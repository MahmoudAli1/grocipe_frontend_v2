<template>  
<div>

  <a class="uk-button uk-button-primary uk-margin" @click="$router.go(-1)"><span uk-icon="arrow-left"></span> go back</a>

  <client-only placeholder="Chargement...">

    <h2>Recipes from the cart items</h2>
    <div uk-grid>
        <div class="uk-width-1-3@m" v-for="recipe in recipes" v-bind:key="recipe" >
          <div class="uk-card uk-card-default uk-card-body uk-width-1-1@m">
              <img :src ="recipe.image" class="uk-align-center" height="100" width="100" alt="" />
              <table class="uk-table uk-table-striped uk-table-small uk-table-responsive">
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="uk-width-1-2">{{recipe.title}}</td>
            </tr>
        </tbody>
    </table>
          </div>
        </div>
    </div>

    <div uk-grid>
        <div class="uk-width-1-3@m">

          <div class="uk-card uk-card-default uk-card-body uk-width-1-1@m">

            <form @submit.stop.prevent="handleSubmit">
                <fieldset class="uk-fieldset">

                    <legend class="uk-legend">Checkout</legend>

                    <div class="uk-margin">
                        <label class="uk-form-label" for="form-stacked-text">Address</label>
                        <input class="uk-input" v-model="address" type="text" placeholder="13 boulevard francis">
                    </div>

                    <div class="uk-margin">
                        <label class="uk-form-label" for="form-stacked-text">City</label>
                        <input class="uk-input" v-model="city" type="text" placeholder="San francisco">
                    </div>

                    <div class="uk-margin">
                        <label class="uk-form-label" for="form-stacked-text">Postal code</label>
                        <input class="uk-input" v-model="postalCode" type="text" placeholder="92000">
                    </div>

                    <div class="uk-margin">
                      <label for="card">Card</label>
                        <card
                          ref="card-stripe"
                          stripe="pk_test_xGtr51hfZWrIbZb5WBznZSlR00MX6GYFE1"
                          @change='complete = $event.complete'
                        />

                    </div>

                    <div class="uk-margin">
                    <button class="uk-button uk-button-primary" v-if="$route.path !== '/orders/checkout'" @click="goToCheckout" name="button">Proceed to checkout ({{ price }}€)</button>
                    </div>

                </fieldset>
            </form>
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
import Cart from '~/components/Cart.vue'  
import { Card, createToken } from 'vue-stripe-elements-plus'  
import axios from 'axios'

export default {  
  components: {
    Card,
    Cart
  },
  data() {
    return {
      address: '',
      postalCode: '',
      city: '',
      complete: false,
      loading: false,
      errored: false,
      recipes:[]
    }
  },
  mounted(){
      let str = '';
      let isFirst = true;
      const items = this.$store.getters['cart/items']
      items.forEach(item => {
          if(isFirst){
              str += item.Name;
              isFirst = false;
          }else{
            str += ","+item.Name;
          }
      });
      axios
      .get(`http://localhost:1337/recipes?ingrediants=${str}`)
      .then(response => {
          this.recipes = response.data
          }).catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      let token
      try {
        const response = await createToken()
        token = response.token.id
      } catch (err) {
        alert('An error occurred.')
        this.loading = false
        return
      }
      try {
        await strapi.createEntry('orders', {
          amount: this.$store.getters['cart/price'],
          items: this.$store.getters['cart/items'],
          address: this.address,
          postalCode: this.postalCode,
          city: this.city,
          token
        })
        alert('Your order have been successfully submitted.')
        this.emptyCart()
        this.$router.push('/')
      } catch (err) {
        this.loading = false
        alert('An error occurred.')
      }
    },
  },
}
</script>  