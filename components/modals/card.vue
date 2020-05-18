  <template lang="pug">
    commonModal.card-modal(id="card" @close="onClose")
      .h1 {{ card.title }}

      .group
        div Labels:
        div labels

      .group
        div Description:
        .description.flex
          editableArea.grow(
            v-model="card.description"
            placeholder="placeholder"
            @change="update"
            textarea)
  </template>

<script>
import { mapState } from 'vuex'
import editableArea from '@/components/editable-area'

export default {
  name: 'card-modal',
  components: {
    editableArea
  },
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
  },
  beforeDestroy () {
    this.onClose()
  }
}
</script>

  <style lang="scss" scoped>
    .card-modal {
      .description {
        min-height: 100px;
        .area {
          height: 100%;
        }
      }
    }
  </style>
