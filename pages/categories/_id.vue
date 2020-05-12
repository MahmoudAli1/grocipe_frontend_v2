<template>  
<div>

  <a class="uk-button uk-button-primary uk-margin" @click="$router.go(-1)"><span uk-icon="arrow-left"></span> go back</a>

  <client-only>
  <div uk-grid>

      <div class="uk-width-1-3@m">
        <div v-for="item in category.items" class="uk-margin" v-bind:key="item">
            <div class="uk-card uk-card-default">
                <div class="uk-card-media-top">
                    <img :src="'http://localhost:1337/' + item.Picture.url" alt="" />
                </div>
                <div class="uk-card-body">
                    <h3 class="uk-card-title">{{ item.Name }} <span class="uk-badge">{{ item.Price }} AED</span></h3>
                </div>
                <div class="uk-card-footer">
                  <button class="uk-button uk-button-primary" @click="addToCart(item)">Add to cart</button>
                </div>
            </div>
        </div>
      </div>

      <div class="uk-width-expand@m">
          <Cart />
      </div>

  </div>

  </client-only>
</div>  
</template>

<script>  
import { mapMutations } from 'vuex'  
import Cart from '~/components/Cart.vue'  
import categoryQuery from '~/apollo/queries/category/category'

export default {  
  data() {
    return {
      category: Object
    }
  },
  apollo: {
    category: {
      prefetch: true,
      query: categoryQuery,
      variables () {
        return { id: this.$route.params.id }
      }
    }
  },
  components: {
    Cart
  },
  methods:{
    ...mapMutations({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove'
    }),
  }
}
</script>