-- Table profiles pour gérer les informations utilisateur
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  has_password BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour lire son propre profil
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Politique pour mettre à jour son propre profil
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politique pour insérer son propre profil
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fonction RPC pour marquer qu'un utilisateur a un mot de passe
CREATE OR REPLACE FUNCTION mark_user_has_password()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, has_password)
  VALUES (auth.uid(), true)
  ON CONFLICT (id) 
  DO UPDATE SET 
    has_password = true,
    updated_at = NOW();
END;
$$;

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, has_password)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Mettre à jour les utilisateurs existants qui n'ont pas de profil
INSERT INTO profiles (id, has_password)
SELECT id, false
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;
