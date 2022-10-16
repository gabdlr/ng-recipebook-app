Este sitio web forma parte de un curso realizado en Udemy "Angular - The Complete Guide (2022 Edition)" por Maximilian Schwarzmüller. Para su realización se utilizo Angular.

This web site is part of a course I've taken in Udemy "Angular - The Complete Guide (2022 Edition)" by Maximilian Schwarzmüller. For its development the Angular framework was employed.

To run this project locally using docker and docker compose:
Go to the Dockerfile and comment lines 6,7,8
Run docker compose build
Go back to the Dockerfile and uncomment lines 6,7,8
Run docker compose up -d
You could previously uncomment line 6 in the docker-compose.yml so that the project get started once you run the container
I prefer to run the container and then get bash with:
docker exec -it  ng-recipebook-app bash
and then inside the container run npm start

You could also run this project without docker if you have NodeJS on your local machine:
Run npm install
Run npm start

GL!HF! =D