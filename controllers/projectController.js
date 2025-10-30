const Project = require('../models/Project');

// @desc    Get all projects for logged in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort('-createdAt');
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PATCH /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Make sure user owns project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Make sure user owns project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
