# Docker Guide - ChangeClothesAI

## Quick Start

### Build and Run Production
```bash
# Build production image
docker build --target production -t changeclothesai:prod .

# Run production container
docker run -p 80:80 changeclothesai:prod
```

### Development with Docker
```bash
# Build and run development
docker-compose up app-dev

# Or build manually
docker build --target development -t changeclothesai:dev .
docker run -p 3000:3000 -v $(pwd):/app changeclothesai:dev
```

## Multi-Stage Build

### Stages:
1. **base**: Common dependencies
2. **development**: Development environment
3. **build**: Build the React app
4. **production**: Nginx server with built app

## Docker Commands

### Build Commands
```bash
# Build all stages
docker build -t changeclothesai .

# Build specific stage
docker build --target development -t changeclothesai:dev .
docker build --target build -t changeclothesai:build .
docker build --target production -t changeclothesai:prod .
```

### Run Commands
```bash
# Development
docker run -p 3000:3000 -v $(pwd):/app changeclothesai:dev

# Production
docker run -p 80:80 changeclothesai:prod

# Build only
docker run -v $(pwd)/build:/app/build changeclothesai:build
```

### Docker Compose
```bash
# Development
docker-compose up app-dev

# Production
docker-compose up app-prod

# Build test
docker-compose up app-build
```

## Troubleshooting

### Build Issues
```bash
# Clean build
docker build --no-cache -t changeclothesai .

# Check build context
docker build --progress=plain -t changeclothesai .
```

### Runtime Issues
```bash
# Check logs
docker logs <container_id>

# Enter container
docker exec -it <container_id> /bin/sh

# Check nginx config
docker exec -it <container_id> nginx -t
```

### Port Issues
```bash
# Check port usage
lsof -i :80
lsof -i :3000

# Use different ports
docker run -p 8080:80 changeclothesai:prod
```

## Production Deployment

### With Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d app-prod
```

### With Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml changeclothesai
```

### With Kubernetes
```bash
# Apply deployment
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

## Environment Variables

### Development
```bash
docker run -e REACT_APP_API_URL=https://api.example.com changeclothesai:dev
```

### Production
```bash
docker run -e NGINX_HOST=yourdomain.com changeclothesai:prod
```

## Security Considerations

### Production Security
- ✅ Nginx security headers configured
- ✅ Content Security Policy enabled
- ✅ XSS protection enabled
- ✅ Frame options set

### API Proxy
- ✅ CORS issues resolved via nginx proxy
- ✅ Secure headers forwarded
- ✅ SSL termination support

## Performance Optimization

### Build Optimization
- ✅ Multi-stage build reduces image size
- ✅ Alpine Linux base images
- ✅ Nginx for static file serving
- ✅ Gzip compression enabled

### Runtime Optimization
- ✅ Static asset caching
- ✅ Browser caching headers
- ✅ Efficient nginx configuration

## Monitoring

### Health Checks
```bash
# Check if container is running
docker ps

# Check resource usage
docker stats

# Check logs
docker logs -f <container_id>
```

### Nginx Monitoring
```bash
# Access logs
docker exec <container_id> tail -f /var/log/nginx/access.log

# Error logs
docker exec <container_id> tail -f /var/log/nginx/error.log
```

## Next Steps

1. **Build**: `docker build --target production -t changeclothesai:prod .`
2. **Test**: `docker run -p 80:80 changeclothesai:prod`
3. **Deploy**: Push to your container registry
4. **Scale**: Deploy to production environment

Your ChangeClothesAI app is now containerized and ready for deployment! 🐳
