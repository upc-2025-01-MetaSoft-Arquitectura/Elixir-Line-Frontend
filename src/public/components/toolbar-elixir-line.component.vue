<script>
import LanguageSwitcher from "./language-switcher.component.vue";
import {User} from "../../ElixirLine/profile/model/User.entity.js";
import {UserApiService} from "../../ElixirLine/employee-management/services/user-api.service.js";
import {useAuthenticationStore} from "../../ElixirLine/security/services/authentication.store.js";
import {FieldWorker} from "../../ElixirLine/employee-management/model/field-worker.entity.js";
import {WinegrowerApiService} from "../../ElixirLine/employee-management/services/winegrower-api.service.js";

export default {
  name: "toolbar-elixir-line",
  components: {LanguageSwitcher},

  data() {
    return {
      items: [
        {label: 'sign-in', to: "/home/sign-in", icon: 'pi pi-user'},
        {label: 'sign-up', to: "/home/sign-up", icon: 'pi pi-user-plus'}
      ],

      arrayWinegrowers: [],

      userData: new User({}), // Inicializar con un objeto User vacío
      winegrowerApiService: null,
      userApiService: null,

    }
  },

  computed: {
    itemsUser() {
      return [
        {
          label: this.$t('menu.label-settings'),
          to: "/home/settings",
          icon: 'pi pi-user',
          command: () => {
            this.$router.push({name: 'ProfileSettings'})  // Navegación usando Vue Router
          }
        },
        {
          label: this.$t('menu.label-sign-out'),
          icon: 'pi pi-cog',
          command: () => {
          }
        }
      ];
    },

    userId() {
      return useAuthenticationStore().currentUserId;
    },

    currentWinegrower() {
      return this.findWinegrowerById(this.userData.id); // suponiendo user.id == winegrower.id
    }
  },

  methods: {

    getUser() {
      console.log("user", this.userId);
      this.userApiService.getUserById(this.userId).then(response => {
        this.userData = new User(response.data);
      }).catch(error => {
        console.error('Error fetching user data:', error);
      });
    },

    findWinegrowerById(id) {
      return this.arrayWinegrowers.find(winegrower => winegrower.id === id);
    },

    getAllWinegrowers() {
      this.winegrowerApiService.getAllWinegrowers().then(response => {

        this.arrayWinegrowers = response.data.map(winegrower => new FieldWorker(winegrower));

        console.log('All winegrowers:', response.data);
      }).catch(error => {
        console.error('Error fetching winegrowers:', error);
      });
    },



  },



  created()
  {
    this.winegrowerApiService = new WinegrowerApiService('/winegrowers');
    this.userApiService  = new UserApiService('/users');

    this.getUser();               // 👈 Obtener el usuario actual
    this.getAllWinegrowers();     // 👈 Obtener lista de viticultores

    console.log('Toolbar Home Elixir Line Created');
  }
}

</script>

<template>

  <pv-toolbar class="toolbar-elixir-line flex" style="background-color: #8B0000; color: #e5edf6; border: none; border-radius: 0;">
    <template #start>
      <div class="brand">
        <!-- Nombre de producto: ElixirLine -->
        <span class="text-white font-bold text-2xl">ElixirLine</span>
      </div>
    </template>

    <template #end>

      <div class="flex flex-row w-full h-full justify-content-between align-items-center ">

        <div class="flex align-items-center pr-2">
          <pv-split-button class="split-button" :model="itemsUser" >
            {{ currentWinegrower?.name + ' ' + currentWinegrower?.lastname }}
          </pv-split-button>
        </div>

        <div>
          <language-switcher/>
        </div>

      </div>


    </template>

  </pv-toolbar>



</template>

<style>


.split-button .p-button {
  background: #8B0000;
  color: #e5edf6;
  border: none;
  border-radius: 0;
  margin-left: 1rem;
}
/*Cambiar color al pasar el cursos*/

.split-button .p-button:not(disabled):hover {
  background: #ab1818;
  color: #e5edf6;
  border: none;
  border-radius: 0;
}



</style>