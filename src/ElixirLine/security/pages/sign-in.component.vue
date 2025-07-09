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

      let authenticationStore = useAuthenticationStore();
      let signInRequest = new SignInRequest(this.username, this.password);

      authenticationStore.signIn(signInRequest, this.$router);

      console.log("Respuesta de Inicio de sesión: ",signInRequest);

    }
  }
}

</script>

<template>

  <div class="login-container flex w-full h-screen p-4"  >

    <!-- ================================ PANEL 01  -->
    <div class="panel-01-container w-6 h-full flex flex-column align-items-center justify-content-center p-2"
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

              <!-- Campo de entrada para el correo electrónico -->
              <div class="field mb-4">
                <pv-float-label>
                  <pv-input-text
                      id="username"
                      v-model="username"
                      :class="{'p-invalid': !username}"
                      class="w-full"
                      autocomplete="email"
                  />
                  <label for="username">Correo electrónico</label>
                </pv-float-label>
                <div class="p-fluid flex flex-column mt-1 ml-1 align-items-start w-full ">
                  <small v-if="!username" class="p-error mt-1">El correo electrónico es obligatorio</small>
                </div>
              </div>

              <!-- Campo de entrada para la contraseña -->
              <div class="field mb-4">
                <pv-float-label>
                  <pv-input-text
                      id="password"
                      v-model="password"
                      type="password"
                      :class="{'p-invalid': !password}"
                      class="w-full"
                      autocomplete="current-password"
                  />
                  <label for="password">Contraseña</label>
                </pv-float-label>
                <div class="p-fluid flex flex-column mt-1 ml-1 align-items-start w-full ">
                  <small v-if="!password" class="p-error mt-1">La contraseña es obligatoria.</small>
                </div>
              </div>

              <!-- Botón de inicio de sesión -->
              <div class="flex flex-column p-field mt-5" >
                <div class="justify-center">

                  <pv-button type="submit"
                             class="w-full text-black font-bold border border-red-900" >
                    Iniciar sesión</pv-button>
                </div>
              </div>

              <!-- Enlace a la página de registro (Texto que funciona como bottom)-->
              <div class="flex flex-column p-field mt-2">
                <div class="justify-center">
                  <router-link to="/elixir-line/sign-up">
                    <p class="w-full text-black font-bold border border-red-900" style="color: #CFAE75; font-size:
                    16px;" >
                      ¿Aún no tienes una cuenta? Crear cuenta</p>
                  </router-link>
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