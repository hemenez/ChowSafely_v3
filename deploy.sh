docker build -t lhemenez/web:latest -t lhemenez/web:$SHA -f ./web/Dockerfile ./web
docker push lhemenez/web:latest
docker push lhemenez/web:$SHA

kubectl apply -f k8s
kubectl set image deployments/web-deployment web=lhemenez/web:$SHA