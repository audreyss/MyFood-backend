const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    id_recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipes'
    }
});

const Bookmark = mongoose.model('bookmarks', bookmarkSchema);

module.exports = Bookmark;