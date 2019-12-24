/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable('users', {
		id: 'id',
		name: { type: 'varchar(255)', notNull: true },
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
		ifExists: true
	})
};

exports.down = pgm => {
	pgm.deleteTable('users', { ifExists: true })
};
