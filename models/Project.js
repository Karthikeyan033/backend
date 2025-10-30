const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  houseType: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'villa', 'apartment']
  },
  length: {
    type: Number,
    required: [true, 'Please add length'],
    min: [1, 'Length must be at least 1']
  },
  width: {
    type: Number,
    required: [true, 'Please add width'],
    min: [1, 'Width must be at least 1']
  },
  floors: {
    type: Number,
    required: [true, 'Please add number of floors'],
    min: [1, 'Floors must be at least 1'],
    max: [100, 'Floors cannot exceed 100']
  },
  constructionType: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'premium', 'luxury']
  },
  location: {
    type: String,
    required: true,
    enum: ['urban', 'suburban', 'rural']
  },
  timeline: {
    type: Number,
    required: true,
    min: [1, 'Timeline must be at least 1 month']
  },
  calculationResults: {
    totalArea: Number,
    totalCost: Number,
    costPerSqFt: Number,
    completionTime: Number,
    foundationCost: Number,
    wallsCost: Number,
    electricalCost: Number,
    interiorCost: Number,
    laborTotal: Number,
    grandTotal: Number,
    length: Number,
    width: Number,
    floors: Number,
    constructionType: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
