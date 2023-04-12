const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: false,
    },
    imageStart: {
      type: String,
      required: false,
    },
    imageEnd: {
      type: String,
      required: false,
    },
    explanation: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    workoutid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
