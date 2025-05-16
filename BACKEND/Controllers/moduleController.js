const { getDB } = require('../database');

exports.renderModulePage = async (req, res) => {
  try {
    const db = getDB();
    const moduleId = req.params.moduleId;

    // Find the course that contains this module
    const course = await db.collection('courses').findOne({ "modules.id": moduleId });

    if (!course) {
      return res.status(404).render('error', {
        message: 'Module not found (no course contains this module).',
        error: {}
      });
    }

    // Find the module in the course's modules array
    const modules = course.modules;
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    const module = modules[moduleIndex];

    if (!module) {
      return res.status(404).render('error', {
        message: 'Module not found in course.',
        error: {}
      });
    }

    // Previous/next module logic
    const previousModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
    const nextModule = moduleIndex < modules.length - 1 ? modules[moduleIndex + 1] : null;

    res.render('module', {
      title: module.title,
      user: req.user,
      courseTitle: course.title,
      module: module,
      previousModule: previousModule,
      nextModule: nextModule,
      pageCss: 'module-content.css'
    });

  } catch (error) {
    console.error('Error rendering module page:', error);
    res.status(500).render('error', {
      message: 'Error loading module page',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
}; 