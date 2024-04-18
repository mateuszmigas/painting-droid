use keyring::{Entry};

pub struct SafeStorage {
    entry: Entry,
}

impl SafeStorage {
    pub fn new(name: &str) -> Result<SafeStorage, String> {
        let service = "Painting Droid Safe Storage";
        let entry = Entry::new(service, name).map_err(|e| e.to_string())?;
        Ok(SafeStorage { entry })
    }

    pub fn set_password(&self, password: &str) -> Result<(), String> {
        self.entry.set_password(password).map_err(|e| e.to_string())
    }

    pub fn get_password(&self) -> Result<String, String> {
        self.entry.get_password().map_err(|e| e.to_string())
    }

    pub fn delete_password(&self) -> Result<(), String> {
        self.entry.delete_password().map_err(|e| e.to_string())
    }
}
