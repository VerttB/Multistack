import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Número de dados a serem gerados
const NUM_USERS = 10;
const NUM_POSTS_PER_USER = 2; // Total de posts gerados: 10 * 2 = 20
const NUM_COMMENTS = 30;

/**
 * Gera um hash de senha seguro.
 * @param password Senha em texto puro.
 * @returns Hash da senha.
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Cria um array de usuários falsos.
 */
async function createFakeUsers() {
  const usersData = [];

  // 1. Cria o Admin (para ter um ponto de referência)
  const adminPasswordHash = await hashPassword('admin123');
  usersData.push({
    name: 'System Admin',
    email: 'admin@system.com',
    password: adminPasswordHash,
    role: Role.ADMIN,
  });

  // 2. Cria os Usuários Falsos
  for (let i = 0; i < NUM_USERS - 1; i++) {
    const passwordHash = await hashPassword('user_pwd_123');
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.USER,
    });
  }

  const createdUsers = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  console.log(`-> ${createdUsers.count} Usuários criados (incluindo Admin).`);
  return prisma.user.findMany(); // Retorna os usuários criados para usar nas próximas etapas
}

/**
 * Cria posts para os usuários fornecidos.
 * @param users Lista de usuários disponíveis.
 */
async function createFakePosts(users: { id: string }[]) {
  const postsData: any[] = [];
  const totalPosts = NUM_USERS * NUM_POSTS_PER_USER;

  for (let i = 0; i < totalPosts; i++) {
    // Seleciona um autor aleatório
    const author = users[i % users.length]; 

    postsData.push({
      title: faker.lorem.sentence({ min: 3, max: 10 }),
      content: faker.lorem.paragraphs(2),
      published: faker.datatype.boolean({ probability: 0.8 }), // 80% publicados
      authorId: author.id,
    });
  }

  // Usamos createMany para inserção em lote
  const createdPosts = await prisma.post.createMany({
    data: postsData,
    skipDuplicates: true,
  });

  console.log(`-> ${createdPosts.count} Posts criados.`);
  return prisma.post.findMany({ include: { author: true } });
}

/**
 * Cria comentários aleatórios nos posts existentes.
 * @param posts Lista de posts disponíveis.
 * @param users Lista de usuários disponíveis.
 */
async function createFakeComments(posts: { id: string }[], users: { id: string }[]) {
  const commentsData: any[] = [];

  for (let i = 0; i < NUM_COMMENTS; i++) {
    // Seleciona um post e um autor aleatórios
    const post = posts[i % posts.length]; 
    const author = users[i % users.length]; 

    commentsData.push({
      content: faker.lorem.sentence({ min: 1, max: 5 }),
      postId: post.id,
      authorId: author.id,
    });
  }

  const createdComments = await prisma.comment.createMany({
    data: commentsData,
    skipDuplicates: true,
  });

  console.log(`-> ${createdComments.count} Comentários criados.`);
}

/**
 * Cria relacionamentos de seguidores (Followers) simples.
 * @param users Lista de usuários disponíveis.
 */
async function createFakeFollowers(users: { id: string }[]) {
  const followersData: any[] = [];
  const numFollows = Math.min(users.length * 2, 50); // Limita para não ser excessivo ou duplicado

  while (followersData.length < numFollows) {
    const follower = users[faker.number.int({ max: users.length - 1 })];
    const following = users[faker.number.int({ max: users.length - 1 })];

    // Impede que um usuário siga a si mesmo
    if (follower.id !== following.id) {
      followersData.push({
        followerId: follower.id,
        followingId: following.id,
      });
    }
  }

  // O Prisma lidará com a unicidade definida no schema (@unique([followerId, followingId]))
  const createdFollows = await prisma.follower.createMany({
    data: followersData,
    skipDuplicates: true,
  });

  console.log(`-> ${createdFollows.count} Relacionamentos de Follower criados.`);
}

/**
 * Cria Likes aleatórios nos posts existentes.
 * @param posts Lista de posts disponíveis.
 * @param users Lista de usuários disponíveis.
 */
async function createFakeLikes(posts: { id: string }[], users: { id: string }[]) {
    const likeData: any[] = [];
    const numLikes = Math.min(posts.length * users.length, 80); // Limita o total de likes

    while (likeData.length < numLikes) {
        const user = users[faker.number.int({ max: users.length - 1 })];
        const post = posts[faker.number.int({ max: posts.length - 1 })];

        likeData.push({
            userId: user.id,
            postId: post.id,
        });
    }
    
    // O Prisma lidará com a unicidade (não pode curtir o mesmo post duas vezes)
    const createdLikes = await prisma.like.createMany({
        data: likeData,
        skipDuplicates: true,
    });
    
    console.log(`-> ${createdLikes.count} Likes criados.`);
}


async function main() {
  console.log('--- INICIANDO SEED COM FAKER ---');

  // Opcional: Limpar dados antigos para testes repetitivos
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follower.deleteMany();
  await prisma.post.deleteMany();
  // Não deletamos todos os usuários para manter o admin persistente se necessário,
  // mas vamos deletar todos exceto o admin, se o email bater.
  await prisma.user.deleteMany({
    where: { email: { not: 'admin@system.com' } }
  });
  console.log('Dados anteriores limpos (exceto um usuário admin de referência).');

  const users = await createFakeUsers();
  
  // Garante que há usuários antes de prosseguir
  if (users.length === 0) {
      console.error("Falha ao criar usuários. Abortando seeding.");
      return;
  }

  const posts = await createFakePosts(users);

  // Garante que há posts antes de prosseguir
  if (posts.length === 0) {
    console.error("Falha ao criar posts. Abortando seeding.");
    return;
  }

  await createFakeComments(posts, users);
  await createFakeFollowers(users);
  await createFakeLikes(posts, users);


  console.log('\n✅ SEEDING CONCLUÍDO COM SUCESSO! Total de dados criados (aproximadamente):');
  console.log(`   - Usuários: ${NUM_USERS}`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Comentários: ${NUM_COMMENTS}`);

}

main()
  .catch((e) => {
    console.error('ERRO FATAL DURANTE O SEEDING:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });