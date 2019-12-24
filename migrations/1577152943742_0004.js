/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', {
        email: {
			type: 'varchar(255)',
            unique: true,
		}
    },
	{
		ifNotExists: true
	})
};

exports.down = pgm => {
    pgm.dropColumns('users', 'email', {
		ifExists: true
    })
};