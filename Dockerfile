FROM nginx:alpine

# Remove arquivos padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia todo o conteúdo da raiz do repositório para o NGINX
COPY . /usr/share/nginx/html/

# Expondo a porta padrão
EXPOSE 80

# Comando padrão do NGINX
CMD ["nginx", "-g", "daemon off;"]