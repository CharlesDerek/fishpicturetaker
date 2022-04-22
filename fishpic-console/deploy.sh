yarn run build
aws s3 sync build/ s3://fishpic-console
