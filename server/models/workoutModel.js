const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    frequency: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    user_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
},
  },
  { timestamps: true }
)

module.exports = mongoose.model('Workout', WorkoutSchema)
