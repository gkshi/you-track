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
  created () {
    console.log('this.activeCard', this.activeCard, this.activeCard._id)
    console.log('this.card', this.card, this.card._id)
    this.card.update(this.activeCard)
    console.log('this.card', this.card, this.card._id)
  },
  methods: {
    onClose () {
      this.$store.dispatch('changeActiveCard', null)
    },
    async update () {
      console.log('this.card', this.card)
      const res = await this.$store.dispatch('api/updateCard', this.card)
      console.log('res', res)
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
