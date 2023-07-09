import time
from typing import Callable
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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
    async def transform_to_profile(self, node, use):
        with use.get_driver() as driver:
            driver.get('https://whatsmyname.app/')
            input_field = driver.find_element(by=By.XPATH, value='//*[@id="targetUsername"]')
            input_field.send_keys(node.username)
            time.sleep(10)
            driver.find_element(
                by=By.XPATH,
                value="/html/body/div/div/div[2]/div[2]/div/div[2]/button"
            ).click()
        # @todo find useful signal to wait for on page:
        # https://stackoverflow.com/questions/73318533/selenium-wait-until-page-is-fully-loaded
            table = WebDriverWait(driver, 90) \
                .until(EC.element_to_be_clickable((By.XPATH, '//*[@id="collectiontable"]')))
            elms = table.find_elements(by=By.CSS_SELECTOR, value="tbody tr")
            data = []
            for elm in elms:
                tds = elm.find_elements(by=By.CSS_SELECTOR, value='td')
                if len(tds) < 4:
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
