#!/usr/bin/env node
'use strict'
/* eslint-disable no-process-exit */

const yargs = require('yargs')

const logger = require('../lib/logger')
const octopusApi = require('../lib/octopus-deploy')
const createRelease = require('../lib/commands/simple-create-release')

const args = yargs
  .usage('Usage:\n  $0 [options]')
  .help('help')
  .alias('h', 'help')
  .describe('host', 'The base url of the octopus deploy server')
  .describe('apiKey', 'Api key used to connect to octopus deploy')
  .describe('projectSlugOrId', 'The id or slug of the octopus project')
  .describe('version', 'The SemVer of the release to create')
  .describe('releaseNotes', 'Notes to associate with the new release')
  .describe('packageVersion', 'The version of the packages to release')
  .describe('channelId', 'The channel to be sued for the release deployments')
  .demandOption(['host', 'apiKey', 'projectSlugOrId', 'version'])
  .example(
    `$0 \\\n --host=https://octopus.acme.com \\\n --apiKey=API-123 \\\n --projectSlugOrId={my-project|projects-123} \\\n --version=2.0.0-rc-4 \\\n --packageVersion=1.0.1 \\\n --releaseNotes="Created release as post-build step"`
  ).argv

const {
  host,
  apiKey,
  projectSlugOrId,
  version,
  releaseNotes,
  packageVersion,
  channelId
} = args

octopusApi.init({ host, apiKey })

logger.info(`Creating release for project '${projectSlugOrId}'...`)

const params = {
  projectSlugOrId,
  version,
  releaseNotes,
  packageVersion,
  channelId
}

createRelease(params)
  .then(release => {
    logger.info(
      `Finished creating release '${release.id}'. ${projectSlugOrId} ${version}`
    )
    return release
  })
  .catch(err => {
    logger.error('Failed to create release. Error:', err)
    process.exit(1)
  })

/* eslint-enable no-process-exit */
