  <template lang="pug">
    common-modal.card-modal(id="card" @close="onClose")
      article
        header
          editableArea.h1(
            type="light"
            v-model="card.title"
            placeholder="Enter a title for this card..."
            @change="update")

        //- section
          div Labels:
          div labels

        section
          div Description:
          .description.flex
            editable-area.grow(
              v-model="card.description"
              placeholder="Add a more detailed description..."
              @change="update"
              textarea)
  </template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'card-modal',
  data () {
    return {
      card: this.$models.create('card')
    }
  },
  computed: {
    ...mapState({
      activeCard: state => state.activeCard
    })
  },
  watch: {
    activeCard: {
      handler () {
        this.card.update(this.activeCard)
      },
      deep: true
    }
  },
  created () {
    this.card.update(this.activeCard)
  },
  methods: {
    onClose () {
      this.$store.dispatch('changeActiveCard', null)
    },
    async update () {
      await this.$store.dispatch('api/updateCard', this.card)
      this.$emit('update', this.card)
    }
  }
}
</script>

  <style lang="scss" scoped>
    .card-modal {
      header {
        margin-bottom: 20px;
      }
      section {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
      }
      .description {
        min-height: 100px;
        .area {
          height: 100%;
        }
      }
    }
  </style>
