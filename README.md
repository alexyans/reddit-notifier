# Daily Reddit Notifier

## Development

The only dependency is Docker Compose.

To set up locally, you need a `.env` file in the root directory with the following format (docker image defaults provided):
```
PGHOST=db
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=postgres

DATABASE_URL=postgres://postgres:postgres@db:5432
SENDGRID_API_KEY=<your key>
```

Then to run the tests:

```bash
$ make build
$ make test
```

To keep a running service for manual testing:
```bash
$ make up
```


## Corners cut

- There is no running cron configuration to dispatch emails automatically. The API endpoint that triggers the functionality would be called from a production taskrunner, or equivalent agent (e.g. CI scheduler, instance-level cron scheduler, etc).
- Scaling has not been taken into consideration. There are known performance bottlenecks.
- Logging and monitoring has not been taken into account. To that end, error handling has been kept to a minimum.
- There is no automated testing for the crawler and mailer services. Testing was done manually.
- A sample email received by a user will be provided.
- Reddit post summaries will not have a cover image if no image exists in the original Reddit post. A placeholder image has been added to signal that there was no preview.
- An example of a config file has been given to demonstrate how the service would be deployed.
- No docblock-style comments. Naming and function decomposition have been used with readability in mind.
- Configuration with environment variables was done to the extent that it was deemed necessary. In production, it would be a lot more polished.