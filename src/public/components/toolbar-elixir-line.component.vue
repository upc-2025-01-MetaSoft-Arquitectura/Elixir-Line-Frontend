<script>
import LanguageSwitcher from "./language-switcher.component.vue";

export default {
  name: "toolbar-elixir-line",
  components: {LanguageSwitcher},

  data() {
    return {
      items: [
        {label: 'sign-in', to: "/home/sign-in", icon: 'pi pi-user'},
        {label: 'sign-up', to: "/home/sign-up", icon: 'pi pi-user-plus'}
      ],

      user: {
        name: 'John Doe',
        email: ' ',
      }

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
            console.log('Cerrar sesión');
          }
        }
      ];
    }
  },



  created()
  {
    console.log('Toolbar Home Elixir Line Created');
  }
}

</script>

<template>

  <pv-toolbar class="toolbar-elixir-line flex" style="background-color: #8B0000; color: #e5edf6; border: none; border-radius: 0;">
    <template #start>
      <div class="brand">
        <img src="https://www.primefaces.org/primevue/showcase/assets/showcase/images/primelogo.svg"
             alt="Logo Elixir Line"/>
      </div>
    </template>

    <template #end>

      <div class="flex flex-row w-full h-full justify-content-between align-items-center ">

        <div class="flex align-items-center pr-2">
          <pv-split-button class="split-button" :model="itemsUser" > {{user.name}} </pv-split-button>
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