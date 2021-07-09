# PBOT Public Involvement Planning
This repository contains the codebase of a Drupal-based content management system (CMS). The site is intended to help PBOT employess collaborate on public involvement internally.

## Developer guide
This repository leverages [Docker](//docker.com) to speed development time. This section will focus on getting a new developer up and running on a machine with Docker and Docker Compose installed already. For the following sections you should have Docker running.
### Building images
You'll first need to build the local images to run the docker services. You can do that by running the following command:
```bash
docker-compose build
```
This will build any images defined as building from Dockerfiles in the `docker-compose.yml` file.
### Starting services
```bash
docker compose up
```
or
```bash
docker-compose up
```
>NOTE: `docker compose` style commands are available in new installations of Docker Desktop. There are issues with this current implementation that prevent `docker compose build` from working properly though.

Once the services are running and you begin to see output, you may navigate to http://localhost:8080 to view the application running.
### Installing Drupal site
Once the services are running, open another terminal windows and start a bash session on the PHP service:
```bash
docker compose exec php bash
```
Once the bash session has started you can use drush to install the site from the configuration in this project:
```bash
drush -y site:install --existing-config
```
This step takes some time to complete. Once it is finished you will have a fully operational development site.
### Stopping services
```bash
docker compose down
```
