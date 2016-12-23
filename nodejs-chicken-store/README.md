# nodejs-chicken-store


Simple REST service for chickens and accompanying models

## Docker Image


A Docker container image for this service can be built by issuing a
`docker build ../nodejs-chicken-store` from the root git repository

## Deployment on OpenShift

The template for this microservice can be added to a project by running `oc create -f ../infrastructure/web-app-ephemeral-mongo-template.yml` from the subdirectory of
this microservice relative to the chicken-scratch project's root.


Once the template has been instantiated via the OpenShift Web Console, running
`oc start-build nodejs-chicken-store --from-repo=../nodejs-chicken-store --follow --wait`
will stream the current subdirectory of the latest git repo commit as binary to
an OpenShift build container.

From there, the build container will create an application image based
on the Dockerfile stored with the streamed source code and
push that image to OpenShift's internal registry. After this step, the
DeploymentConfig defined in the template will ensure that pods, services, routes,
and replication controllers are in place to handle the non-functional interconnectivity
and quality of service layers.
