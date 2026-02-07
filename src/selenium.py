# Import pour voir la methode sleep
import time

# Import des bibliotheques
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions

# Instancier (= ouvrir) un navigateur Chrome
driver = webdriver.Chrome()

# Temps d'attente implicit
# Temps maximal qu'on autorise selenium a attendre qu'un
# element soit present sur le navigateur
# Ici on configure un temps de 3 secondes
driver.implicitly_wait(3)

# Ouvrir la page cible
driver.get("https://www.selenium.dev/selenium/web/ajaxy_page.html")

# 1. Selectionner la text box
typer_txt_box = driver.find_element(By.NAME, "typer")

# 2. Remplir celle-ci avec du text
typer_txt_box.send_keys("Bonjour à tous")

# 3. Selectionner un radio button (green ou red)
green_radio_btn = driver.find_element(By.ID, "green")

# 4. Cliquer sur le bouton selectionne
green_radio_btn.click()

# 5. Selectionner le bouton "Add Label"
submit_btn = driver.find_element(By.NAME, "submit")

# 6. Cliquer sur ce bouton
submit_btn.click()

# 7. Selectionner la div qui a été créée

# On attend que la div créé en JS soit bien visible
# Et on le selectionne
result_div = WebDriverWait(driver, 10).until(
        # Que la div div.label soit visible
        expected_conditions.visibility_of_element_located(
            (By.CSS_SELECTOR, "div.label")
        )
)

# Pour du debug j'ajoute un sleep de 10s à la fin du script
# Ceci permet d'éviter de fermer le navigateur des que le
# script se termine
time.sleep(10)

# On ferme explicitement le navigateur
driver.quit()
