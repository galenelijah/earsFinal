const { getDB } = require('../database');
const { ObjectId } = require('mongodb');

// Render progress page
exports.renderProgressPage = async (req, res) => {
  try {
    const db = getDB();
    const userIdentifier = req.user._id; // Assuming req.user._id is an ObjectId from the auth middleware

    const userProgressRecords = await db.collection('user_progress')
      .find({ user: userIdentifier })
      .toArray();

    const enrichedProgress = [];
    if (userProgressRecords.length > 0) {
        for (const progressRecord of userProgressRecords) {
            const moduleId = progressRecord.module; // This is the string ID, e.g., "cs_module1"

            const courseContainingModule = await db.collection('courses')
                                             .findOne({ "modules.id": moduleId });

            let moduleData = null;
            if (courseContainingModule && courseContainingModule.modules) {
                moduleData = courseContainingModule.modules.find(m => m.id === moduleId);
            }

            if (moduleData) {
                enrichedProgress.push({
                    ...progressRecord,
                    module: moduleData // Attach the full module object
                });
            } else {
                console.warn(`Module data not found for moduleId: ${moduleId} in user progress for user: ${userIdentifier}`);
                enrichedProgress.push({
                    ...progressRecord,
                    module: { title: 'Unknown Module', category: '', difficulty: '', estimatedDuration: '' } // Provide defaults
                });
            }
        }
    }

    const overallStats = calculateOverallStats(enrichedProgress);

    res.render('progress', {
      title: 'My Progress',
      user: req.user,
      overallStats,
      progress: enrichedProgress,
      pageCss: 'progress.css'
    });
  } catch (error) {
    console.error('Error rendering progress page:', error);
    res.status(500).render('error', {
      message: 'Error loading progress page',
      error
    });
  }
};

// Get user progress for all modules (API endpoint)
exports.getUserProgress = async (req, res) => {
  try {
    const db = getDB();
    const userIdentifier = req.user._id;

    const userProgressRecords = await db.collection('user_progress')
      .find({ user: userIdentifier })
      .toArray();

    const enrichedProgress = [];
    if (userProgressRecords.length > 0) {
        for (const progressRecord of userProgressRecords) {
            const moduleId = progressRecord.module; 

            const courseContainingModule = await db.collection('courses')
                                             .findOne({ "modules.id": moduleId });

            let moduleData = null;
            if (courseContainingModule && courseContainingModule.modules) {
                moduleData = courseContainingModule.modules.find(m => m.id === moduleId);
            }

            if (moduleData) {
                enrichedProgress.push({
                    ...progressRecord,
                    module: moduleData 
                });
            } else {
                console.warn(`API: Module data not found for moduleId: ${moduleId} for user: ${userIdentifier}`);
                enrichedProgress.push({
                    ...progressRecord,
                    module: { title: 'Unknown Module', category: '', difficulty: '', estimatedDuration: '' } 
                });
            }
        }
    }

    res.json({
      success: true,
      data: enrichedProgress
    });
  } catch (error) {
    console.error('Error fetching progress via API:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
};

// Get progress for a specific module
exports.getModuleProgress = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const db = getDB();
    const userIdentifier = req.user._id;
    
    const progressRecord = await db.collection('user_progress').findOne({
      user: userIdentifier,
      module: moduleId // moduleId is a string from params
    });

    if (!progressRecord) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }

    const courseContainingModule = await db.collection('courses')
                                     .findOne({ "modules.id": moduleId });
    let moduleData = null;
    if (courseContainingModule && courseContainingModule.modules) {
        moduleData = courseContainingModule.modules.find(m => m.id === moduleId);
    }

    if (!moduleData) {
        // This case might indicate orphaned progress data or an issue
        console.warn(`Module data not found for specific progress record. ModuleId: ${moduleId}, User: ${userIdentifier}`);
        return res.status(404).json({
            success: false,
            message: 'Associated module data not found for this progress record.'
        });
    }

    res.json({
      success: true,
      data: {
        ...progressRecord,
        module: moduleData
      }
    });
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching module progress'
    });
  }
};

// Update module progress
exports.updateModuleProgress = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { percentageComplete, overallStatus } = req.body;
    const db = getDB();
    
    const now = new Date();
    const result = await db.collection('user_progress').findOneAndUpdate(
      {
        user: req.user._id,
        module: moduleId // Use string moduleId
      },
      {
        $set: {
          percentageComplete,
          overallStatus,
          lastUpdated: now
        },
        $setOnInsert: {
          user: req.user._id, // Ensure user is set on insert
          module: moduleId,    // Ensure module is set on insert
          startedAt: now
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: result.value // .value contains the updated or inserted document
    });
  } catch (error) {
    console.error('Error updating module progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating module progress'
    });
  }
};

// Mark a module as completed
exports.completeModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const db = getDB();
    
    const now = new Date();
    const result = await db.collection('user_progress').findOneAndUpdate(
      {
        user: req.user._id,
        module: moduleId // Use string moduleId
      },
      {
        $set: {
          completedAt: now,
          overallStatus: 'completed',
          percentageComplete: 100,
          lastUpdated: now
        },
        $setOnInsert: {
          user: req.user._id, // Ensure user is set on insert
          module: moduleId,    // Ensure module is set on insert
          startedAt: now
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    res.json({
      success: true,
      message: 'Module marked as completed',
      data: result.value // .value contains the updated or inserted document
    });
  } catch (error) {
    console.error('Error completing module:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing module'
    });
  }
};

// Helper function to calculate overall stats
function calculateOverallStats(progressRecords) {
  const stats = {
    completionPercentage: 0,
    modulesCompleted: 0,
    modulesInProgress: 0,
    modulesAssigned: progressRecords.length,
    averageScore: 0
  };

  if (progressRecords.length === 0) {
    return stats;
  }

  let totalScore = 0;
  let modulesWithScore = 0;

  progressRecords.forEach(record => {
    if (record.module && (record.overallStatus === 'completed' || record.overallStatus === 'passed')) {
      stats.modulesCompleted++;
      if (record.overallScore) {
        totalScore += record.overallScore;
        modulesWithScore++;
      }
    } else if (record.module && record.overallStatus === 'in-progress') {
      stats.modulesInProgress++;
    }
  });

  stats.completionPercentage = stats.modulesAssigned > 0 ? Math.round((stats.modulesCompleted / stats.modulesAssigned) * 100) : 0;
  stats.averageScore = modulesWithScore > 0 ? Math.round(totalScore / modulesWithScore) : 0;

  return stats;
}

module.exports = exports; 