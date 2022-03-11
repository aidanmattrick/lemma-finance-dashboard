group "default" {
    targets = ["eth-event-subscriptions"]
}

target "eth-event-subscriptions" {
    tags = ["us-west1-docker.pkg.dev/sage-philosophy-321119/docker/eth-event-subscriptions:latest"]
    platforms = ["linux/amd64"]
    context = "."
}
