const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: false,
    },
    reps: {
      type: Number,
      required: false,
    },
    load: {
      type: Number,
      required: false,
    },
    time: {
      type: Number,
      required: false,
    },
    timeUnit: {
      type: String,
      required: false,
    },
    imageStartFile: {
      type: String,
      required: false,
    },
    imageEndFile: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
    },
    imageStartPublicId: {
      type: String,
    },
    imageEndPublicId: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
