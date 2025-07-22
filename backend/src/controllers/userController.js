const { prisma } = require('../database/connection');

// GET /users - Listar todos os usuários
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Não retornar a senha
      },
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// GET /users/:id - Buscar usuário por ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// POST /users - Criar novo usuário
async function createUser(req, res) {
  try {
    const { email, name, password, age } = req.body;

    // Validações básicas
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, nome e senha são obrigatórios',
      });
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // Em produção, deve ser criptografada
        age: age ? parseInt(age) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: newUser,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// PUT /users/:id - Atualizar usuário
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, name, password, age, active } = req.body;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Se o email está sendo alterado, verificar se já existe
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email já cadastrado',
        });
      }
    }

    // Preparar dados para atualização
    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) updateData.password = password;
    if (age !== undefined) updateData.age = age ? parseInt(age) : null;
    if (active !== undefined) updateData.active = Boolean(active);

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// DELETE /users/:id - Deletar usuário
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
