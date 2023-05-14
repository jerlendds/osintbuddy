from selenium.webdriver.common.by import By
from osintbuddy.node import TextInput
from osintbuddy.plugins import OBPlugin, transform


class UsernamePlugin(OBPlugin):
    label = 'Username'
    name = 'Username'
    color = '#BF288D'
    node = [
        TextInput(label='Username', icon='IconUserSearch'),
    ]

    @transform(label='To profile', icon='IconUser')
    def transform_to_profile(self, node, **kwargs):
        with kwargs['get_driver']() as driver:
            driver.get('https://whatsmyname.app/')
            input_field = driver.find_element(by=By.XPATH, value='//*[@id="targetUsername"]')
            input_field.send_keys(node['data'][0])
            driver.find_element(
                by=By.XPATH,
                value="/html/body/div/div/div[2]/div[2]/div/div[2]/button"
            ).click()
            table = driver.find_element(by=By.XPATH, value='//*[@id="collectiontable"]')
            elms = table.find_elements(by=By.CSS_SELECTOR, value="tbody tr")
            data = []
            for elm in elms:
                tds = elm.find_elements(by=By.CSS_SELECTOR, value='td')
                blueprint = SocialProfilePlugin.blueprint()
                blueprint['elements'][0]['value'] = tds[2].text
                blueprint['elements'][1]['value'] = tds[0].text
                blueprint['elements'][2]['value'] = tds[3].text
                blueprint['elements'][3]['value'] = tds[1].text
                data.append(blueprint)
            return data


class SocialProfilePlugin(OBPlugin):
    label = 'Profile'
    show_label = False
    name = 'Social Profile'
    color = '#D842A6'
    node = [
        TextInput(label='Category', icon='IconCategory'),
        TextInput(label='Site', icon='world'),
        TextInput(label='Link', icon='IconLink'),
        TextInput(label='Username', icon='IconUser'),
    ]
