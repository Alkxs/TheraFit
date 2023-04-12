const mongoose = require('mongoose')

const WorkoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    // user_id: {
    //   type: String,
    //   required: true,
    // },
    user_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
},
  },
  { timestamps: true }
)

module.exports = mongoose.model('Workout', WorkoutSchema)
