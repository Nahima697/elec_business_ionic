import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

try:
    # 1. Ouvrir l'application Ionic
    print("Ouverture du navigateur...")
    driver.get("http://localhost:4200/login")

    # Attendre un peu que la page charge (méthode brutale, on fera mieux après avec WebDriverWait)
    time.sleep(2)

    # 2. Trouver les éléments (Adapte les sélecteurs selon ton HTML !)
    print("Remplissage du formulaire...")

    email_input = driver.find_element(By.CSS_SELECTOR, "ion-input[type='email'] input")
    email_input.send_keys("user1@test.com")

    password_input = driver.find_element(By.CSS_SELECTOR, "ion-input[type='password'] input")
    password_input.send_keys("password123")

    # 3. Cliquer sur le bouton de connexion
    login_btn = driver.find_element(By.CSS_SELECTOR, "ion-button[type='submit']")
    login_btn.click()

    print("Connexion cliquée !")

    # Pause pour voir le résultat
    time.sleep(5)

except Exception as e:
    print(f"Une erreur est survenue : {e}")

finally:
    # Fermer le navigateur
    driver.quit()
    print("Test terminé.")
