import { shallowMount } from '@vue/test-utils'
import App from './src/App.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld)
    expect(wrapper).toBeDefined()
  })
})
