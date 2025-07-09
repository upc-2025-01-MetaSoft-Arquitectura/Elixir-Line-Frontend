<script>
import {useAuthenticationStore} from "../services/authentication.store.js";
import {SignUpRequest} from "../model/sign-up.request.js";
import {CreateUserWinegrower} from "../model/create-user-winegrower.entity.js";
import {UserSignUpApiService} from "../services/user-sign-up.api.service.js";
import {UserApiService} from "../../employee-management/services/user-api.service.js";
import {WinegrowerSignUpApiService} from "../services/winegrower-sign-up.api.service.js";
import {UserWinegrower} from "../model/user-winegrower.entity.js";

export default {
  name: "sign-up",
  components: {},
  data() {
    return {
      authenticationStore: useAuthenticationStore(),

      createUserWinegrower: new CreateUserWinegrower({}),

      userId: null,

      userSignUpApiService: null,
      userApiService: null,
      winegrowerSignUpApiService: null,

    };
  },
  methods: {

    async onSignUp() {

      const { email, password, role, name, lastname, country, phoneNumber } = this.createUserWinegrower;

      try {
        // 1. Crear usuario
        const signUpResponse = await this.userSignUpApiService.create(
            new SignUpRequest(email, password, 'WINEGROWER' )
        );

        const userId = signUpResponse.id;

        // 2. Crear viticultor asociado
        try {
          await this.winegrowerSignUpApiService.create(
              new UserWinegrower({ userId, name, lastname, country, phoneNumber })
          );
        } catch (winegrowerError) {
          // Intentar revertir el usuario si falla la segunda creación
          await this.userSignUpApiService.delete(userId).catch(() => {
            console.warn('No se pudo eliminar el usuario luego de fallo en viticultor.');
          });
          throw winegrowerError;
        }

        // 3. Éxito
        this.$toast.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'El usuario fue creado correctamente',
          life: 3000
        });
        this.$router.push({ name: 'sign-in' });

      } catch (error) {
        // 4. Error general
        console.error('Error al registrar usuario:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario',
          life: 3000
        });
      }
    }

  },

  created() {
    this.userSignUpApiService = new UserSignUpApiService('/authentication/sign-up');
    this.winegrowerSignUpApiService = new WinegrowerSignUpApiService('/winegrowers');
    this.userApiService = new UserApiService('/users');

  }



}
</script>

<template>


  <div class="login-container flex w-full h-screen p-4"  >

    <!-- ================================ PANEL 01 ======================================  -->
    <div class="panel-02-container flex flex-1 flex-column h-full justify-content-center">

      <div class="flex flex-column w-full p-6">






        <!-- Formulario de inicio de sesión -->
        <div class="form-sign-in">



          <div class="relative w-full mb-6 align-items-center">
            <!-- Flecha a la izquierda -->
            <pv-button
                icon="pi pi-arrow-left"
                class="p-button-rounded p-button-text absolute left-0 top-1/2 -translate-y-1/2"
                @click="$router.push({ name: 'sign-in' })"
                style="font-size: 1.8rem; color: #CFAE75"
                aria-label="Volver"
            />

            <!-- Título centrado -->
            <h1 class="text-center text-6xl font-bold leading-none">
              <span style="color: #8B0000">Elixir</span><span style="color: #CFAE75">Line</span>
            </h1>
          </div>





          <p class="flex w-full "> <strong> Forma parte de la familia de ElixirLine: </strong> </p>

          <form @submit.prevent="onSignUp" class="content-form">
            <div class="p-fluid">

              <!-- Nombre -->
              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="name"
                    v-model="createUserWinegrower.name"
                    :class="{ 'p-invalid': !createUserWinegrower.name }"
                    class="w-full"
                />
                <label for="name">Nombre</label>
              </pv-float-label>


              <!-- Apellido -->

              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="lastname"
                    v-model="createUserWinegrower.lastname"
                    :class="{ 'p-invalid': !createUserWinegrower.lastname }"
                    class="w-full"
                />
                <label for="lastname">Apellido</label>
              </pv-float-label>


              <!-- Teléfono -->
              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="phone"
                    v-model="createUserWinegrower.phoneNumber"
                    :class="{ 'p-invalid': !createUserWinegrower.phoneNumber }"
                    class="w-full"
                />
                <label for="phone">Teléfono</label>
              </pv-float-label>

              <!-- País -->
              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="country"
                    v-model="createUserWinegrower.country"
                    :class="{ 'p-invalid': !createUserWinegrower.country }"
                    class="w-full"
                />
                <label for="country">País</label>
              </pv-float-label>


              <!-- Email -->
              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="email"
                    v-model="createUserWinegrower.email"
                    :class="{ 'p-invalid': !createUserWinegrower.email }"
                    class="w-full"
                    autocomplete="email"
                    type="email"
                />
                <label for="email">Correo electrónico</label>
              </pv-float-label>


              <!-- Contraseña -->

              <pv-float-label class="field mt-4">
                <pv-input-text
                    id="password"
                    type="password"
                    v-model="createUserWinegrower.password"
                    :feedback="false"
                    :class="{ 'p-invalid': !createUserWinegrower.password }"
                    class="w-full"
                />
                <label for="password">Contraseña</label>
              </pv-float-label>

              <!-- Botón de registrar usuario -->
              <pv-button
                  label="Registrar usuario"
                  type="submit"
                  class="w-full mt-4"
                  severity="primary"
                  :disabled="!createUserWinegrower.name || !createUserWinegrower.lastname || !createUserWinegrower.phoneNumber || !createUserWinegrower.country || !createUserWinegrower.email || !createUserWinegrower.password"
              />


            </div>


          </form>
        </div>

      </div>

    </div>
    <!-- ============================= FIN PANEL 01 ======================================  -->



    <!-- ================================ PANEL 02 ======================================  -->
    <div class="panel-01-container w-6 h-full flex flex-column align-items-center justify-content-center p-4"
         style="background-color: #8B0000;">

      <h1 style="color: #e5edf6"> "Hacemos que el proceso fluya como un buen vino" </h1>

      <div class="flex flex-column align-items-center justify-content-center">
        <img src="../../../assets/img/login.png" width="70%" alt="" />
      </div>


    </div >

    <!-- ================================ FIN PANEL 02 ======================================  -->


  </div>



</template>

<style scoped>
.ml-2 {
  margin-left: 0.5rem;
}
</style>