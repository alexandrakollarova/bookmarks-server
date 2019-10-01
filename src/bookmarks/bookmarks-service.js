const BookmarksService = {
    getAllBookmarks(knex) {
        return knex
            .select('*')
            .from('bookmarks')
    },

    getById(knex, id) {
        return knex
            .from('bookmarks')
            .select('*')
            .where('id', id)
            .first()
    },

    insert(knex, newBookmark) {
        return knex 
            .insert(newBookmark)
            .into('bookmarks')
            .returning('*')
            .then(rows => rows[0])
    },

    delete(knex, id) {
        return knex
            .from('bookmarks')
            .where('id', id)
            .del()
    },

    update(knex, id, newBookmarkFields) {
        return knex
            .from('bookmarks') 
            .where({id})
            .update(newBookmarkFields)
    }
}

module.exports = BookmarksService