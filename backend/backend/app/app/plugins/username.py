import time
from selenium.webdriver.common.by import By
from osintbuddy.elements import TextInput
import osintbuddy as ob


class UsernamePlugin(ob.Plugin):
    label = 'Username'
    name = 'Username'
    color = '#BF288D'
    node = [
        TextInput(label='Username', icon='user-search'),
    ]

    @ob.transform(label='To profile', icon='user')
    async def transform_to_profile(self, node, **kwargs):
        with kwargs['get_driver']() as driver:
            driver.get('https://whatsmyname.app/')
            input_field = driver.find_element(by=By.XPATH, value='//*[@id="targetUsername"]')
            input_field.send_keys(node['data'][0])
            time.sleep(10)
            driver.find_element(
                by=By.XPATH,
                value="/html/body/div/div/div[2]/div[2]/div/div[2]/button"
            ).click()
            table = driver.find_element(by=By.XPATH, value='//*[@id="collectiontable"]')
            elms = table.find_elements(by=By.CSS_SELECTOR, value="tbody tr")
            
            
            data = []
            for elm in elms:
                tds = elm.find_elements(by=By.CSS_SELECTOR, value='td')

                blueprint = SocialProfilePlugin.blueprint(
                    category=tds[2].text,
                    site=tds[0].text,
                    link=tds[3].text,
                    username=tds[1].text
                )
                data.append(blueprint)
            return data


class SocialProfilePlugin(ob.Plugin):
    label = 'Profile'
    show_label = False
    name = 'Social Profile'
    color = '#D842A6'
    node = [
        TextInput(label='Category', icon='category'),
        TextInput(label='Site', icon='world'),
        TextInput(label='Link', icon='link'),
        TextInput(label='Username', icon='user'),
    ]
