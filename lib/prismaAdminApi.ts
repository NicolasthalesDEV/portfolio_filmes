import prisma from './prisma'

export async function loginAdmin({ email, password }: { email: string; password: string }) {
	const user = await prisma.user.findUnique({ where: { email } })
	if (!user) throw new Error('Usuário não encontrado')
	if (user.password !== password) throw new Error('Senha incorreta')
	return user
}

export async function getAdminById(id: string) {
	const user = await prisma.user.findUnique({ where: { id } })
	if (!user) throw new Error('Usuário não encontrado')
	return user
}
