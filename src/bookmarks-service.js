const BookmarksService = {
    getAllBookmarks(knex) {
        return knex
            .select('*')
            .from('bookmarks')
    },

    insert(knex, newBookmark) {
        return knex 
            .insert(newBookmark)
            .into('bookmarks')
            .returning('*')
            .then(rows => rows[0])
    },

    deleteBookmark(knex, id) {
        return knex
            .where({id})
            .delete()
    },

    updateBookmark(knex, id, newBookmarkFields) {
        return knex 
            .where({id})
            .update(newBookmarkFields)
    }
}

module.exports = BookmarksService