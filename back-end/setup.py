from setuptools import setup
import sys

package_name='j7s_web_v2'
semver = '0.0.0'

setup(name=package_name,
      version=semver,
      description='Backend for j7s_web_v2',
      author='James Pace',
      author_email='jpace121@gmail.com',
      url='git.jpace121.net',
      license='Apache 2.0',
      packages=[package_name],
      setup_requires=['wheel'],
      install_requires=['aiohttp', 'pydantic'],
      entry_points = {
        'console_scripts': ['j7s_web=j7s_web_v2.main:main'],
      },
      zip_safe=False)
