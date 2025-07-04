<script>

import {SignInRequest} from "../model/sign-in.request.js";
import {useAuthenticationStore} from "../services/authentication.store.js";

export default {
  name: "sing-in",
  components: {},

  data() {
    return {
      username: '',
      password: '',
      isAuthenticated: false

    };
  },

  methods: {
    onSignIn() {

      this.isAuthenticated = true;
      this.$router.push({ name: 'ElixirLineHome', params :{id:'1'} });
      console.log('Autenticación exitosa');


      /*
      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);
      authenticationStore.signIn(signInRequest, this.$router);
      */
    }
  }
}

</script>

<template>

  <div class="login-container flex w-full h-screen p-4"  >

    <!-- ================================ PANEL 01  -->
    <div class="panel-01-container w-6 h-full flex flex-column align-items-center justify-content-center "
    style="background-color: #8B0000;">

      <h1 style="color: #e5edf6"> "Hacemos que el proceso fluya como un buen vino" </h1>

      <div class="flex flex-column align-items-center justify-content-center">
        <img src="../../../assets/img/login.png" width="70%" alt="" />
      </div>


    </div >

    <!-- ================================ PANEL 02  -->
    <div class="panel-02-container flex flex-1 flex-column h-full justify-content-center">

      <div class="flex flex-column w-full p-6">

        <!-- 🔑 Formulario de inicio de sesión -->
        <div class="form-sign-in">

          <h1> <span style="color: #8B0000">Elixir</span><span style="color: #CFAE75">Line</span> </h1>

          <h2 class="flex w-full "> Bienvenido de nuevo  👋 </h2>
          <p class="flex w-full "> <strong> Nos alegramos de tenerle de vuelta </strong> </p>


          <form @submit.prevent="onSignIn" class="content-form">
            <div class="p-fluid">
              <div class="field mt-5 ">
                <pv-float-label class="flex flex-column">
                  <label for="username">Ingrese su correo electrónico</label>
                  <pv-input-text id="username" v-model="username" :class="{'p-invalid': !username }" />
                  <!--<small v-if="!username" class="p-invalid">Username is required.</small>-->
                </pv-float-label>
              </div>
              <div class="field mt-5">
                <pv-float-label class="flex flex-column">
                  <label for="password">Ingrese su contraseña</label>
                  <pv-input-text id="password" v-model="password" :class="{'p-invalid': !password }" type="password"/>
                  <!--<small v-if="!password" class="p-invalid">Password is required.</small>-->
                </pv-float-label>
              </div>
              <div class="flex flex-column p-field mt-5" >
                <div class="justify-center">

                  <pv-button type="submit"
                             class="w-full text-black font-bold border border-red-900" >
                    Iniciar sesión</pv-button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>

    </div>

  </div>


</template>

<style >



</style>