#!/bin/bash
# Helper scripts for working with Docker image and container.

# Variables
IMAGE_NAME="openinfolabs/osintbuddy-backend"
CONTAINER_NAME="backend"
REPOSITORY_PATH="docker.io"
FULLY_QUALIFIED_IMAGE_NAME="$REPOSITORY_PATH/$IMAGE_NAME"
HOST_PORT=5000
CONTAINER_PORT=5000

# Get version from package.json file so can tag the built image with version number.
# If you don't have node installed, you can just hardcode the version number here.
source ./version_env.sh
IMAGE_VERSION=$VERSION
echo $IMAGE_VERSION $VERSION
# Builds the Docker image and tags it with latest version number.
buildImage () {
    echo Building Image Version: $IMAGE_VERSION ...
    docker compose build --no-cache
    docker tag $IMAGE_NAME:latest $IMAGE_NAME:$IMAGE_VERSION 
    echo Build complete.
}

# Runs the container locally.
runContainer () {
    docker run --rm \
        --name $CONTAINER_NAME \
        -p $HOST_PORT:$CONTAINER_PORT \
        -e "NODE_ENV=development" \
        -d $IMAGE_NAME
    echo Container started. Open browser at http://localhost:$HOST_PORT .
}

# Pushes the latest version of the image both with the `latest` and specific version tags
pushImage () {
    docker tag $IMAGE_NAME:latest $IMAGE_NAME:$IMAGE_VERSION
    docker push $IMAGE_NAME:latest
    docker push $IMAGE_NAME:$IMAGE_VERSION
}

# Shows the usage for the script.
showUsage () {
    echo "Description:"
    echo "    Builds, runs and pushes Docker image '$IMAGE_NAME'."
    echo ""
    echo "Options:"
    echo "    build: Builds a Docker image ('$IMAGE_NAME')."
    echo "    run: Runs a container based on an existing Docker image ('$IMAGE_NAME')."
    echo "    buildrun: Builds a Docker image and runs the container."
    echo "    createrepo: Creates new ECR repo called '$IMAGE_NAME'"
    echo "    push: Pushs the image '$IMAGE_NAME' to an image repository"
    echo ""
    echo "Example:"
    echo "    ./docker-task.sh build"
    echo ""
    echo "    This will:"
    echo "        Build a Docker image named $IMAGE_NAME."
}

if [ $# -eq 0 ]; then
  showUsage
else
  case "$1" in
      "build")
             buildImage
             ;;
      "run")
             runContainer
             ;;
      "buildpush")
             buildImage
             pushImage
             ;;
      "push")
             pushImage
             ;;
      "buildrun")
             buildImage
             runContainer
             ;;
      *)
             showUsage
             ;;
  esac
fi