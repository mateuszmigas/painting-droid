use keyring::{Entry, Result};

pub struct SafeStorage {
    entry: Entry,
}

impl SafeStorage {
    pub fn new(name: &str) -> Result<SafeStorage> {
        let service = "Painting Droid Safe Storage";
        let entry = Entry::new(service, name)?;
        Ok(SafeStorage { entry })
    }

    pub fn set_password(&self, password: &str) -> Result<()> {
        self.entry.set_password(password)
    }

    pub fn get_password(&self) -> Result<String> {
        self.entry.get_password()
    }

    pub fn delete_password(&self) -> Result<()> {
        self.entry.delete_password()
    }

    pub fn has_password(&self) -> Result<bool> {
        match self.entry.get_password() {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    }
}
