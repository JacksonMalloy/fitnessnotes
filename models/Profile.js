const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    // Connects ID in User Model
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  bio: {
    type: String
  },
  status: {
    type: String
  },
  website: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },

  // Each Session
  session: [
    {
      workout: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },

      // Each Exercise
      exercise: [
        {
          name: {
            type: String,
            required: true
          },
          sets: [
            {
              reps: {
                type: Number,
                required: true
              },
              weight: {
                type: Number,
                required: true
              }
            }
          ],
          notes: {
            type: String
          },
          completed: {
            type: Boolean
          }
        }
      ],
      completed: {
        type: Boolean
      }
    }
  ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
