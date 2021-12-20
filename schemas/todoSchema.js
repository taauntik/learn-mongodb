const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance methods
todoSchema.methods = {
  findActive: () => mongoose.model("Todo").find({ status: "active" }),
  findInActive: (cb) => mongoose.model("Todo").find({ status: "inactive" }, cb),
};

// static methods
todoSchema.statics = {
  findByJs: function() {
    return this.find({ title: /learn/i });
  },
};

// query helpers
todoSchema.query = {
    byLanguage: function(language) {
        return this.find({ title: new RegExp(language, "i") });
    }
}

module.exports = todoSchema;
