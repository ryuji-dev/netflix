const _ = require('lodash');

// directorIds 검증
const directorIdsStr = pm.environment.get('directorIds');
if (!directorIdsStr || typeof directorIdsStr !== 'string') {
  throw new Error(
    'directorIds 환경 변수가 설정되지 않았거나 문자열이 아닙니다.',
  );
}
const directorIds = directorIdsStr.split(',');
const radomDirectorId = _.sample(directorIds);
pm.environment.set('director', radomDirectorId);

// genreIds 검증
const genreIdsStr = pm.environment.get('genreIds');
if (!genreIdsStr || typeof genreIdsStr !== 'string') {
  throw new Error('genreIds 환경 변수가 설정되지 않았거나 문자열이 아닙니다.');
}
const genreIds = genreIdsStr.split(',');
const pickedGenreIds = [];
let failCount = 0;

while (pickedGenreIds.length < 3 && failCount < 20) {
  const radomGenreId = _.sample(genreIds);
  if (pickedGenreIds.includes(radomGenreId)) {
    failCount++;
    continue;
  }
  pickedGenreIds.push(radomGenreId);
}

pm.environment.set('genres', pickedGenreIds);
