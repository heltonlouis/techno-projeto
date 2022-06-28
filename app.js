new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item Adicionado",
        alertaAtivo: false,
    },

    filters: {
      numeroPreco(valor){
        return valor.toLocaleString(
            "pt-BR", { style: "currency", currency: "BRL" }
        )
      }  
    },

    computed: {
        carrinhoTotal() {
            let total = 0;
            if(this.carrinho.length) {
                this.carrinho.forEach(element => {
                    total += element.preco;
                });
            }
            return total;
        }
    },

    methods: {
        fetchProdutos(){
            fetch("./api/produtos.json")
            .then(resp => resp.json())
            .then(resp => {
                this.produtos = resp;
            })
        },
        fetchItemProduto(id){
            fetch(`./api/produtos/${id}/dados.json`)
            .then(resp => resp.json())
            .then(resp => {
                this.produto = resp;
            })
        },
        abrirModal(id){
            this.fetchItemProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        fecharModal(event){
            if (event.target === event.currentTarget) {
                this.produto = false;
            }
        },
        adicionarItem(){
            this.produto.estoque--;
            const {id, nome, preco } = this.produto;
            this.carrinho.push({ id, nome, preco });
            this.alerta(`${nome} foi adicionado ao carrinho com sucesso!`)
        },
        removerItem(index){
            this.carrinho.splice(index, 1);
        },
        checarLocalStorage() {
            if(window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500)
        }
    }, 

    watch: {
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },

    created(){
        this.fetchProdutos();
        this.checarLocalStorage()
    }
})