/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable('user_subreddits', {
		id: 'id',
		user_id: {
			type: 'integer',
			references: 'users',
			notNull: true
		},
		url: { type: 'varchar(255)', notNull: true },
		createdAt: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp')
		},
		updatedAt: {
			type: 'timestamp',
			notNull: false,
		}
	},
	{
		ifNotExists: true
	})
};

exports.down = pgm => {
	pgm.deleteTable('user_subreddits', { ifExists: true })
};
