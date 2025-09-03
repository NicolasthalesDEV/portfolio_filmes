-- Script para criar a tabela page_content no Supabase
-- Execute este SQL no SQL Editor do Supabase Dashboard

-- Criar tabela para gerenciar conteúdo das páginas
CREATE TABLE IF NOT EXISTS page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type text NOT NULL CHECK (page_type IN ('about', 'contact', 'home')),
  content jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índice único para garantir que existe apenas um registro por tipo de página
CREATE UNIQUE INDEX IF NOT EXISTS page_content_page_type_unique 
ON page_content (page_type);

-- Habilitar RLS (Row Level Security)
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso completo (ajuste conforme necessário)
CREATE POLICY "Enable all access for page_content" ON page_content
  FOR ALL USING (true);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at quando um registro for modificado
CREATE TRIGGER update_page_content_updated_at 
    BEFORE UPDATE ON page_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE page_content IS 'Armazena o conteúdo dinâmico das páginas About, Contact e Home';
COMMENT ON COLUMN page_content.page_type IS 'Tipo da página: about, contact ou home';
COMMENT ON COLUMN page_content.content IS 'Conteúdo da página em formato JSON';
