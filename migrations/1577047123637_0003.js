/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', {
        isNotified: {
			type: 'boolean',
			default: true,
			notNull: true
		}
    },
	{
		ifNotExists: true
	})
};

exports.down = pgm => {
    pgm.dropColumns('users', 'isNotified', {
		ifExists: true
    })
};
